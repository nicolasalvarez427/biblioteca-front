import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
    selector: 'app-book-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './book-form.html',
    styleUrls: ['./book-form.scss']
})
export class BookFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly bookService = inject(BookService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    public form!: FormGroup;
    public editing = false;
    private bookId: string | null = null;

    ngOnInit(): void {
        this.form = this.fb.group({
            titulo: ['', [Validators.required, Validators.minLength(3)]],
            autor: ['', [Validators.required, Validators.minLength(3)]],
            isbn: [''],
            stock: [1, [Validators.required, Validators.min(1)]],
            imagenUrl: ['']
        });

        this.bookId = this.route.snapshot.paramMap.get('id');
        if (this.bookId) {
            this.editing = true;
            this.loadBook();
        }
    }

    loadBook(): void {
        this.bookService.getBookById(this.bookId!).subscribe({
            next: (book: Book) => this.form.patchValue(book),
            error: (err) => alert('Error al cargar el libro: ' + (err.error?.message || 'Desconocido'))
        });
    }

    volver(): void {
        this.router.navigate(['/admin/libros']);
    }


    onSubmit(): void {
        if (this.form.invalid) return;

        const data = this.form.value;
        if (this.editing) {
            this.bookService.updateBook(this.bookId!, data).subscribe({
                next: () => {
                    alert('✅ Libro actualizado correctamente.');
                    this.router.navigate(['/admin/libros']);
                },
                error: (err) => alert('❌ Error al actualizar: ' + (err.error?.message || 'Desconocido'))
            });
        } else {
            this.bookService.createBook(data).subscribe({
                next: () => {
                    alert('✅ Libro creado correctamente.');
                    this.router.navigate(['/admin/libros']);
                },
                error: (err) => alert('❌ Error al crear: ' + (err.error?.message || 'Desconocido'))
            });
        }
    }
}
